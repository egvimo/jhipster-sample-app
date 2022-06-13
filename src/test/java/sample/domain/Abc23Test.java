package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc23Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc23.class);
        Abc23 abc231 = new Abc23();
        abc231.setId(1L);
        Abc23 abc232 = new Abc23();
        abc232.setId(abc231.getId());
        assertThat(abc231).isEqualTo(abc232);
        abc232.setId(2L);
        assertThat(abc231).isNotEqualTo(abc232);
        abc231.setId(null);
        assertThat(abc231).isNotEqualTo(abc232);
    }
}
