package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc14Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc14.class);
        Abc14 abc141 = new Abc14();
        abc141.setId(1L);
        Abc14 abc142 = new Abc14();
        abc142.setId(abc141.getId());
        assertThat(abc141).isEqualTo(abc142);
        abc142.setId(2L);
        assertThat(abc141).isNotEqualTo(abc142);
        abc141.setId(null);
        assertThat(abc141).isNotEqualTo(abc142);
    }
}
