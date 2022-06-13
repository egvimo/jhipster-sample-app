package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc12Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc12.class);
        Abc12 abc121 = new Abc12();
        abc121.setId(1L);
        Abc12 abc122 = new Abc12();
        abc122.setId(abc121.getId());
        assertThat(abc121).isEqualTo(abc122);
        abc122.setId(2L);
        assertThat(abc121).isNotEqualTo(abc122);
        abc121.setId(null);
        assertThat(abc121).isNotEqualTo(abc122);
    }
}
